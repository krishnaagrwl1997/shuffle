import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventCtx } from '../components/EventLayout';
import { BottomBar, Sheet, Toast, useToast } from '../components/ui';
import { Icon } from '../components/Icon';
import { addPhoto, compressImage, deletePhoto, listPhotos, type Photo } from '../lib/photos';
import { memoriesMessage, whatsappUrl } from '../lib/invite';
import { uid } from '../lib/kit';

export function Memories() {
  const { event, update } = useEventCtx();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<Photo | null>(null);
  const [toast, showToast] = useToast();

  useEffect(() => { listPhotos(event.id).then(setPhotos); }, [event.id]);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    let added = 0;
    for (const file of Array.from(files).slice(0, 30)) {
      try {
        const dataUrl = await compressImage(file);
        await addPhoto({ id: uid(), eventId: event.id, dataUrl, caption: '', createdAt: Date.now() + added });
        added++;
      } catch {
        /* skip files that aren't images */
      }
    }
    setPhotos(await listPhotos(event.id));
    setBusy(false);
    showToast(added ? `Added ${added} photo${added === 1 ? '' : 's'}` : "Those files couldn't be read as photos.");
  };

  const remove = async (p: Photo) => {
    await deletePhoto(p.id);
    setPhotos((all) => all.filter((x) => x.id !== p.id));
    setOpen(null);
  };

  return (
    <>
      <section className="screen-title">
        <h1>After the event</h1>
        <p className="lede">Collect photos and write a thank-you. Guests get a memory pack with everyone's cards and the photos.</p>
      </section>

      <section className="group">
        <div className="field">
          <label htmlFor="thanks">Thank-you note</label>
          <textarea id="thanks" rows={3} style={{ minHeight: 96 }} maxLength={400} value={event.thankYou}
            placeholder={`Thank you for coming to ${event.name || 'our event'}! It wouldn't have been the same without you.`}
            onChange={(e) => update((ev) => ({ ...ev, thankYou: e.target.value }))} />
        </div>
      </section>

      <section className="group">
        <div className="group-head">
          <h2 className="group-title">Photos</h2>
          <span className="spec">{photos.length}</span>
        </div>
        {photos.length === 0 ? (
          <p className="hint">Add photos from the event. They're kept on this device for now.</p>
        ) : (
          <div className="photo-grid">
            {photos.map((p) => (
              <button key={p.id} className="photo" onClick={() => setOpen(p)} aria-label="Open photo">
                <img src={p.dataUrl} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
        <label className="btn ghost block" style={{ cursor: 'pointer' }}>
          <Icon name="image" /> {busy ? 'Adding…' : 'Add photos'}
          <input type="file" accept="image/*" multiple className="sr-only" disabled={busy} onChange={(e) => { onFiles(e.target.files); e.target.value = ''; }} />
        </label>
        <p className="hint">A shared photo wall, where guests add their own photos, arrives with accounts.</p>
      </section>

      <Sheet open={!!open} title="Photo" onClose={() => setOpen(null)}>
        {open && (
          <>
            <img src={open.dataUrl} alt="" style={{ width: '100%', borderRadius: 14 }} />
            <button className="btn danger block" onClick={() => remove(open)}><Icon name="trash" size={18} /> Delete photo</button>
          </>
        )}
      </Sheet>

      <Toast text={toast} />
      <BottomBar>
        <button className="btn ghost" aria-label="Back to Track" onClick={() => navigate('../track')}><Icon name="back" /></button>
        <button className="btn ghost" aria-label="Preview memory pack" onClick={() => navigate(`/memories/${event.id}`)}><Icon name="eye" /></button>
        <a className="btn" href={whatsappUrl(memoriesMessage(event))} target="_blank" rel="noreferrer"><Icon name="share" /> Share with guests</a>
      </BottomBar>
    </>
  );
}
