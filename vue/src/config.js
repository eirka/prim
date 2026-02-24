// Runtime config injected by the host server via window.primConfig
// Falls back to defaults for development
const config = window.primConfig || {
  api_srv: '',
  img_srv: '',
  ib_id: 1,
  csrf_token: '',
  title: 'Prim',
  discord_widget: ''
}

export default config
