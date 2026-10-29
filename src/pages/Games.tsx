import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { PlayingCard } from '../components/KitItems';
import { BottomBar, Segmented, SwitchRow } from '../components/ui';
import { Icon } from '../components/Icon';
import { SUIT_NAMES } from '../lib/kit';
import { matchGroups, suitTeams, tableGroups, type Dealt } from '../lib/games';

type Game = 'match' | 'teams' | 'tables';

const GAMES: Record<Game, { title: string; how: string }> = {
  match: { title: 'Find your match', how: 'Everyone with the same number finds each other. The first complete group of four wins.' },
  teams: { title: 'Suit teams', how: 'Spades, Hearts, Diamonds and Clubs become four teams for quizzes, games or a cricket match.' },
  tables: { title: 'Table groups', how: 'Mix people across tables so friends meet someone new. Pick how many tables you have.' },
};

function People({ members, event }: { members: Dealt[]; event: Parameters<typeof PlayingCard>[0]['event'] }) {
  if (members.length === 0) return <p className="hint">Nobody yet.</p>;
  return (
    <div className="mini-deck">
      {members.map(({ guest, index }) => (
        <div key={guest.id} className="mini-person">
          <PlayingCard event={event} guest={guest} index={index} small />
        </div>
      ))}
    </div>
  );
}

export function Games() {
  const { event } = useEventCtx();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game>('match');
  const [onlyComing, setOnlyComing] = useState(true);
  const [tables, setTables] = useState(3);

  return (
    <>
      <Segmented label="Game" value={game} onChange={setGame}
        options={[{ value: 'match', label: 'Match' }, { value: 'teams', label: 'Teams' }, { value: 'tables', label: 'Tables' }]} />

      <section className="screen-title">
        <h1>{GAMES[game].title}</h1>
        <p className="lede">{GAMES[game].how}</p>
      </section>

      <section className="group" style={{ paddingBlock: 4, gap: 0 }}>
        <SwitchRow label="Only people who said yes" checked={onlyComing} onChange={setOnlyComing} />
        {game === 'tables' && (
          <>
            <div className="divider" />
            <div className="switch-row">
              <span className="switch-label">Tables</span>
              <div className="stepper app">
                <button aria-label="Fewer tables" onClick={() => setTables((n) => Math.max(1, n - 1))}>−</button>
                <b aria-live="polite">{tables}</b>
                <button aria-label="More tables" onClick={() => setTables((n) => Math.min(12, n + 1))}>+</button>
              </div>
            </div>
          </>
        )}
      </section>

      {game === 'match' && matchGroups(event, onlyComing).map(({ rank, members }) => (
        <section key={rank} className="group">
          <div className="group-head"><h2 className="group-title">All the {rank}s</h2><span className="spec">{members.length} of 4</span></div>
          <People members={members} event={event} />
        </section>
      ))}

      {game === 'teams' && suitTeams(event, onlyComing).map(({ suit, members }) => (
        <section key={suit} className="group">
          <div className="group-head"><h2 className="group-title"><span className={suit === '♥' || suit === '♦' ? 'red-text' : ''}>{suit}</span> {SUIT_NAMES[suit]}</h2><span className="spec">{members.length} people</span></div>
          <People members={members} event={event} />
        </section>
      ))}

      {game === 'tables' && tableGroups(event, tables, onlyComing).map((members, i) => (
        <section key={i} className="group">
          <div className="group-head"><h2 className="group-title">Table {i + 1}</h2><span className="spec">{members.length} people</span></div>
          <People members={members} event={event} />
        </section>
      ))}

      {event.guests.length === 0 && <div className="empty"><p>Add guests to deal their cards into games.</p></div>}

      <BottomBar>
        <button className="btn ghost" aria-label="Back to Track" onClick={() => navigate('../track')}><Icon name="back" /></button>
        <button className="btn" onClick={() => navigate('../checkin')}><Icon name="check" /> Open check-in</button>
      </BottomBar>
    </>
  );
}
