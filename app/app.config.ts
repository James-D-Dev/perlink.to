export default defineAppConfig({
  ui: {
    colors: {
      primary: 'perlink-cyan',
      neutral: 'slate',
    },
    colorMode:{
      preference: 'light',
      fallback: 'light',
    },
    modal: {
      variants: {
         overlay: {
          true: {
            overlay: 'bg-black/75 backdrop-blur-xs'
          }
        },
      }
    }
  },
})
