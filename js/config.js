/* ============================================================
   CONFIG.JS — this is the ONLY file you need to edit.

   HOW TO ADD YOUR OWN SOUNDS & GIFS (no coding needed):
   1. Drop your sound file into  assets/sounds/   and your gif
      into  assets/gifs/  using the exact file name listed for
      that key below (e.g. "1.mp3" and "1.gif" for the 1 key).
   2. Refresh the page. The app automatically detects the file
      and uses it instead of the built-in placeholder animation
      / tone. No JS editing required for a simple swap.

   WANT DIFFERENT FILE NAMES OR LABELS INSTEAD?
   Just edit the "sound" / "gif" / "label" / "sub" values below.

   fallbackEmoji / fallbackAnim / fallbackFreqs are only used
   automatically WHEN a real gif/sound file isn't found — so the
   phone always works out of the box, even before you add assets.
   ============================================================ */

const PHONE_CONFIG = {

  // sound played + screen glow shown while the lid opens/closes
  flip: {
    openSound:  'assets/sounds/flip-open.mp3',
    closeSound: 'assets/sounds/flip-close.mp3'
  },

  keys: [
    { id:'1', label:'1', sub:'',     sound:'assets/sounds/r.m4a', gif:'assets/gifs/r.gif',
      fallbackEmoji:'🐥', fallbackAnim:'anim-bounce', fallbackFreqs:[523.25,659.25] },

    { id:'2', label:'2', sub:'ABC',  sound:'assets/sounds/a.m4a', gif:'assets/gifs/a.gif',
      fallbackEmoji:'🐶', fallbackAnim:'anim-wiggle', fallbackFreqs:[587.33,739.99] },

    { id:'3', label:'3', sub:'DEF',  sound:'assets/sounds/n.m4a', gif:'assets/gifs/n.gif',
      fallbackEmoji:'🐱', fallbackAnim:'anim-jump',   fallbackFreqs:[659.25,830.61] },

    { id:'4', label:'4', sub:'GHI',  sound:'assets/sounds/b.mp3', gif:'assets/gifs/b.gif',
      fallbackEmoji:'🦋', fallbackAnim:'anim-spin',   fallbackFreqs:[698.46,880.00] },

    { id:'5', label:'5', sub:'JKL',  sound:'assets/sounds/d.mp3', gif:'assets/gifs/d.webp',
      fallbackEmoji:'🌈', fallbackAnim:'anim-pulse',  fallbackFreqs:[783.99,987.77] },

    { id:'6', label:'6', sub:'MNO',  sound:'assets/sounds/r.m4a', gif:'assets/gifs/r.gif',
      fallbackEmoji:'🐰', fallbackAnim:'anim-jump',   fallbackFreqs:[880.00,1046.50] },

    { id:'7', label:'7', sub:'PQRS', sound:'assets/sounds/a.m4a', gif:'assets/gifs/a.gif',
      fallbackEmoji:'⭐', fallbackAnim:'anim-spin',   fallbackFreqs:[987.77,1174.66] },

    { id:'8', label:'8', sub:'TUV',  sound:'assets/sounds/n.m4a', gif:'assets/gifs/b.gif',
      fallbackEmoji:'🐬', fallbackAnim:'anim-bounce', fallbackFreqs:[1046.50,1318.51] },

    { id:'9', label:'9', sub:'WXYZ', sound:'assets/sounds/b.mp3', gif:'assets/gifs/b.gif',
      fallbackEmoji:'🎈', fallbackAnim:'anim-wiggle', fallbackFreqs:[1174.66,1396.91] },

    { id:'star', label:'★', sub:'', sound:'assets/sounds/r2.m4a', gif:'assets/gifs/s2.gif',
      fallbackEmoji:'✨', fallbackAnim:'anim-pulse', fallbackFreqs:[440.00,554.37,659.25], special:true },

    { id:'0', label:'0', sub:'', sound:'assets/sounds/d.mp3', gif:'assets/gifs/d.webp',
      fallbackEmoji:'🚀', fallbackAnim:'anim-jump', fallbackFreqs:[523.25,659.25,783.99] },

    { id:'hash', label:'#', sub:'', sound:'assets/sounds/r2.m4a', gif:'assets/gifs/s.gif',
      fallbackEmoji:'🍭', fallbackAnim:'anim-flip', fallbackFreqs:[659.25,830.61,987.77], special:true },
  ]
};
