// todo notify attachment & get theme for tab...

async function applyScrollbar() {
  console.log("hello I am also in your tab :)");
  const accentColor = 'red';
  const style = `:root{
  scrollbar-color: ${accentColor} rgba(0, 0, 0, 0) !important;
  scrollbar-width: thin !important;
}`;
  const styleText = document.createTextNode(style);
  const styleTag = document.createElement('style');
  styleTag.id = 'doki_scrollbar';
  styleTag.append(styleText);
  document.head.append(styleTag);
}

applyScrollbar();
