// Word-based fold, inspired by reactbits.dev/text-animations/fold-text.
// The page timeline owns playback so the effect follows the existing scenes.
export default function FoldText({ text }) {
  return <span className="fold-text" aria-label={text}>
    <span aria-hidden="true">{text.split(/(\s+)/).map((part, index) => /\s/.test(part)
      ? part
      : <span className="fold-hinge" key={index}><span className="fold-piece">{part}</span></span>)}</span>
  </span>;
}
