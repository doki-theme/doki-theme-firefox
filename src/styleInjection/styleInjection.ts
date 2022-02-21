
async function initialize() {
  console.log('hello I am in your tab :)');
  const style = `:root{
  caret-color: red !important; 
}
::selection{
  color: blue !important;
  background-color: red !important;
}
`;
  /*Add style to HTML document*/
  const styleText = document.createTextNode(style);
  const styleTag = document.createElement('style');
  styleTag.id = 'doki_selection';
  styleTag.append(styleText);
  document.head.append(styleTag);
}

initialize()
