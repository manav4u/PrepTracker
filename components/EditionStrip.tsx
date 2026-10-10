import React from 'react';
type Fact = { value: React.ReactNode; label: string };
/** A working-page index. Values come from the page's own current records. */
export default function EditionStrip({code, title, facts}: {code:string; title:string; facts:Fact[]}) {
  return <section className="edition-strip" aria-label={title}>
    <div className="edition-strip-index"><span>{code}</span><p>{title}</p></div>
    <div className="edition-strip-facts">{facts.map((f,i)=><div key={f.label}><small>{String(i+1).padStart(2,'0')} / {f.label}</small><strong>{f.value}</strong></div>)}</div>
    <div className="edition-strip-mark" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
  </section>;
}
