import { CrudService } from 'src/app/service/crud.service';
import { ServiceappService } from 'src/app/service/serviceapp.service';
import { UserRegistrationService } from './../user-registration.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import * as EmailValidator from 'email-validator';

@Component({
  selector: 'app-input-emailortel',
  templateUrl: './input-emailortel.component.html',
  styleUrls: ['./input-emailortel.component.css']
})
export class InputEmailortelComponent implements OnInit {

  statusBt = false;
  @Input() input: any;
  constructor(private router: Router, private userServ: UserRegistrationService, private service: ServiceappService,
              private crud: CrudService) { }

  ngOnInit(): void {


  }

  onClickConfirm(input: string) {
    // this.router.navigate(['/registration/code']); // LINHA TESTE
    // return; // LINHA TESTE
    if (EmailValidator.validate(input)) {
       /* EMAIL */
       console.log('Cadastro com email');
       this.userServ.setTypeReg('email');
       this.userServ.setDataUserEmail(input);
       this.postApi(input, 'enviatokenemail');

      } else {
       /* TELEFONE */
       // Verifica se o telefone está correto
       console.log(input.length);
       // if (input.length !== 14) { this.service.mostrarMensagem('Informe um email ou telefone para fazer seu cadastro.'); return; }
       if (input.length !== 14) { this.service.mostrarMensagem('Informe seu telefone para realizar o cadastro.'); return; }
       console.log('Cadastro com telefone');
       this.userServ.setTypeReg('phone');
       this.userServ.setDataUserPhone(input);
       this.postApi(input, 'enviaTokenTelefone');
     }
  }

  postApi(value, typeAPI) {
    this.statusBt = true;
    const a = () => {
      const r = this.service.getRespostaApi();
      console.log(r);

      if (r.erro) { this.service.mostrarMensagem(r.detalhes); this.statusBt = false; return; }
      this.router.navigate(['/registration/code']);
    };
    this.crud.post_api(/*'enviatokenemail'*/ typeAPI , a, value, false);

  }

}
