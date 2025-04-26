import Services from "./index";

class AuthServices extends Services {
  constructor() {
    super({
      config: {
        baseURL: 'http://localhost:5000/api-acesso/v1/TSMAcesso',
        auth: {
          username: 'pompeia',
          password: 'lfcl',
        },
        timeout: 60 * 1000,
      },
    });
  }

  getObterDadosUsuario(codigoUsuario) {
    return this.axios.get(`${this.url}/ObterDadosUsuario/${codigoUsuario}`);
  }

  getEstabelecimentosUsuario(codigoUsuario) {
    return this.axios.get(
      `${this.url}/ObterEstabelecimentosDoUsuario/${codigoUsuario}`
    );
  }

  getObterEstabelecimentosUsuarioCompleto(codigoUsuario) {
    return this.axios.get(
      `${this.url}/ObterEstabelecimentosDoUsuarioCompleto/${codigoUsuario}`
    );
  }

  getObterPermissao(codigoUsuario, permissao) {
    return this.axios.get(
      `${this.url}/ObterPermissao/${codigoUsuario}/${permissao}`
    );
  }

  getValidarUsuario(login, senha) {
    return this.axios.get(
      `${this.url}/ValidarUsuario/${login}/${senha}`
    );
  }
}

export default new AuthServices();
