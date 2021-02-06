import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BagService } from './../bag/bag.service';
import { CrudService } from './../../service/crud.service';
import { ServiceappService } from './../../service/serviceapp.service';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  constructor(public service: ServiceappService, private crud: CrudService, private cookies: CookieService, private bagServ: BagService,
              private router: Router, private activatedRoute: ActivatedRoute) {

    let buscarLoja = false;
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.loja) {
        buscarLoja = true;
      }
    });

    if (!this.service.getEmpresas() && this.service.sistemMultStores && !buscarLoja) {
      this.router.navigate(['/buscar-lojas']);

    }
    this.crud.pegaHost().subscribe(data => {
      console.log(data[0].host);
      this.service.setHost(data[0].host, data[0].api);
    }, error => { console.error('Erro ao carregar o host'); });


    if (this.cookies.check('user')) {
      try {
        // console.warn('Usuário já fez o login');
        if (this.cookies.check('address_user')) {
          const address = JSON.parse(this.cookies.get('address_user'));
          this.bagServ.setEnderecoEntrega(address);
        }

      } catch (e) { console.log(e); }
    } else {
      // console.log('Usuário ainda não fez o login');
    }

    if (this.cookies.check('user')) {
      //  console.log('Faz login automático!!!!!!!!!!!!!!!!!!!!!!!!!!');
      setTimeout(() => { this.entrar(); }, 600);

    } else {
      // console.log('NÂO Faz login automático!!!!!!!!!!!!!!!!!!!!!!!!!!');

    }

  }

  ngOnInit(): void {

    window.scrollTo(0, 0);

  }

  entrar() {
    const a = () => {
      const r = this.service.getRespostaApi();
      if (r.erro) { /*this.service.mostrarMensagem(r.detalhes);*/ this.cookies.deleteAll(); return; }
      this.service.setDadosUsuario(r.resultado);
      this.service.setToken(r.resultado.token);
    };
    this.crud.post_api('login', a, { email: this.cookies.get('user'), senha: this.cookies.get('pass') }, false);

  }

}
