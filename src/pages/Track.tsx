import { Link, useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { BottomBar } from '../components/ui';
import { Icon, type IconName } from '../components/Icon';
import { RsvpPill } from './Guests';
import { firstName, guestFunctions, headcount } from '../lib/kit';
import { t } from '../lib/i18n';
import { reminderMessage, whatsappUrl } from '../lib/invite';
import type { Diet, Guest } from '../lib/types';

const daysAgo = (ts: number) => {
  const d = Math.floor((Date.now() - ts) / 86_400_000);
  return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`;
};

export function Track() {
  const { event, update } = useEventCtx();
  const navigate = useNavigate();
  const en = t('en');
  const gs = event.guests;
  const yes = gs.filter((g) => g.rsvp === 'yes');
  const no = gs.filter((g) => g.rsvp === 'no');
  const waiting = gs.filter((g) => g.rsvp === null);
  const people = headcount(gs);
  const notes = gs.filter((g) => g.message.trim());
  const diets = (['veg', 'nonveg', 'jain', 'vegan'] as Diet[])
    .map((d) => ({ d, n: yes.filter((g) => g.diet === d).length }))
    .filter((x) => x.n > 0);

  const markReminded = (g: Guest) =>
    update((e) => ({ ...e, guests: e.guests.map((x) => (x.id === g.id ? { ...x, remindedAt: Date.now() } : x)) }));
  const nextToRemind = waiting.find((g) => g.sentAt && !g.remindedAt) ?? waiting.find((g) => g.sentAt);

  const tools: { to: string; icon: IconName; title: string; sub: string }[] = [
    { to: '../checkin', icon: 'check', title: 'Check-in', sub: `${gs.filter((g) => g.checkedIn).length} of ${yes.length} arrived` },
    { to: '../games', icon: 'dice', title: 'Card games', sub: 'Find your match, teams, tables' },
    { to: '../memories', icon: 'image', title: 'Memories', sub: 'Photos and a thank-you' },
    { to: '../print', icon: 'printer', title: 'Printed merch', sub: event.printEnabled ? 'Added' : 'Optional add-on' },
  ];

  return (
    <>
      <section className="screen-title">
        <h1>{people} {people === 1 ? 'person' : 'people'} coming</h1>
        <p className="lede">{yes.length} guests said yes{people > yes.length ? `, bringing ${people - yes.length} more` : ''}.</p>
      </section>

      <div className="stats">
        <div className="stat yes"><div className="big">{yes.length}</div><div className="small">Coming</div></div>
        <div className="stat"><div className="big">{waiting.length}</div><div className="small">Waiting</div></div>
        <div className="stat"><div className="big">{no.length}</div><div className="small">Can't come</div></div>
      </div>

      {event.functions.length > 0 && (
        <section className="list">
          {event.functions.map((f) => {
            const invited = gs.filter((g) => guestFunctions(event, g).some((x) => x.id === f.id));
            const coming = invited.filter((g) => g.fnRsvp[f.id] === 'yes');
            const heads = coming.reduce((n, g) => n + 1 + g.plusOnes, 0);
            return (
              <div className="line" key={f.id}>
                <div><b>{f.name}</b><span className="spec">{invited.length} invited · {invited.filter((g) => !g.fnRsvp[f.id]).length} waiting</span></div>
                <span className="qty">{heads} coming</span>
              </div>
            );
          })}
        </section>
      )}

      {diets.length > 0 && (
        <section className="group">
          <h2 className="group-title">Food</h2>
          <div className="chip-row">
            {diets.map(({ d, n }) => <span key={d} className="tag">{en.diets[d]} · {n}</span>)}
          </div>
          {yes.some((g) => !g.diet) && event.askDiet && <p className="hint">{yes.filter((g) => !g.diet).length} coming guests haven't picked yet.</p>}
        </section>
      )}

      {waiting.length > 0 && (
        <section className="group">
          <div className="group-head">
            <h2 className="group-title">Waiting for a reply</h2>
            <span className="spec">{waiting.length}</span>
          </div>
          <div className="list inset">
            {waiting.map((g) => (
              <div key={g.id} className="list-row static">
                <span className="main">
                  <span className="t1" style={{ display: 'block' }}>{g.name}</span>
                  <span className="t2" style={{ display: 'block' }}>
                    {!g.sentAt ? 'Invite not sent yet' : g.remindedAt ? `Reminded ${daysAgo(g.remindedAt)}` : `Invited ${daysAgo(g.sentAt)}`}
                  </span>
                </span>
                {g.sentAt ? (
                  <a className="btn small ghost" href={whatsappUrl(reminderMessage(event, g))} target="_blank" rel="noreferrer" onClick={() => markReminded(g)}>Remind</a>
                ) : (
                  <Link className="btn small ghost" to="../send">Send</Link>
                )}
              </div>
            ))}
          </div>
          <p className="hint">Automatic reminders (3 days and 1 day before) switch on with accounts. For now, Remind opens WhatsApp with a friendly nudge.</p>
        </section>
      )}

      {notes.length > 0 && (
        <section className="group">
          <h2 className="group-title">Notes from guests</h2>
          {notes.map((g) => (
            <div key={g.id} className="reply-box">
              <div className="reply-row"><b>{g.name}</b><RsvpPill rsvp={g.rsvp} /></div>
              <p className="reply-msg">“{g.message}”</p>
            </div>
          ))}
        </section>
      )}

      {!event.printEnabled && yes.length > 0 && (
        <section className="promo">
          <div>
            <b>{yes.length} people are coming. Want printed cards and stickers for them?</b>
            <span>Only for people who said yes. Totally optional.</span>
          </div>
          <Link className="btn small" to="../print">See options</Link>
        </section>
      )}

      <section className="tool-grid">
        {tools.map((x) => (
          <Link key={x.to} to={x.to} className="tool">
            <span className="tool-icon"><Icon name={x.icon} /></span>
            <b>{x.title}</b>
            <span>{x.sub}</span>
          </Link>
        ))}
      </section>

      <BottomBar>
        <button className="btn ghost" aria-label="Back" onClick={() => navigate('../send')}><Icon name="back" /></button>
        {nextToRemind ? (
          <a className="btn" href={whatsappUrl(reminderMessage(event, nextToRemind))} target="_blank" rel="noreferrer" onClick={() => markReminded(nextToRemind)}>
            <Icon name="share" /> Remind {firstName(nextToRemind.name)}
          </a>
        ) : (
          <button className="btn" onClick={() => navigate('../checkin')}><Icon name="check" /> Open check-in</button>
        )}
      </BottomBar>
    </>
  );
}
