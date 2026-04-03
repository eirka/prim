// Runtime config injected by the host server via window.primConfig
// Falls back to defaults for development
const config: PrimConfig = window.primConfig || {
  ib_id: 3,
  title: 'Meta',
  logo: 'meta.png',
  img_srv: '//images.chounyuu.com',
  api_srv: '//m.chounyuu.com/api',
  csrf_token:
    '7gMr6SDhkz1poT6HjK1rM1Od7eQIHzjcT17ulpbpgS2DAE/Qh37exovYU2PwKhpIPgcg0LBaW7Z/9NNZtIZuig==',
  discord_widget: 'https://discord.com/api/guilds/191608193833631753/widget.json',
  //test_mode: 'mod',
};

export default config;
