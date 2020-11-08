import { BagService } from './../../inicio/bag/bag.service';
import { ServiceappService } from './../../service/serviceapp.service';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-addfp',
  templateUrl: './addfp.component.html',
  styleUrls: ['./addfp.component.css']
})
export class AddfpComponent implements OnInit {

  form: FormGroup;

  constructor(public service: ServiceappService, public bagServ: BagService,
              public dialogRef: MatDialogRef<AddfpComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      valor: [''],
    });
  }

  onClickConfirm(item) {
    if (this.bagServ.getItensCarrinho().length === 0) { this.service.mostrarMensagem('Seu carrinho está vázio. :('); return; }
    if (!this.form.value.valor || this.form.value.valor === '') { this.service.mostrarMensagem('Informe o valor'); return; }
    console.log(parseFloat(this.form.value.valor) + this.bagServ.verificaFpsTotal());
    if ( parseFloat(this.form.value.valor) + this.bagServ.verificaFpsTotal() > this.bagServ.getTotalCarrinho()) {
      this.service.mostrarMensagem('Você informou o valor maior que o total do pedido');
      return;
    }
    // calcular o total de fps
    if (this.form.value.valor > this.bagServ.getTotalCarrinho()) {
      this.service.mostrarMensagem('Ops..! Você informou o valor do pagamento maior que o valor total do pedido'); return;
    }
    let statusItemSelecionado = false;
    if (item.itens) {
      item.itens.forEach(element => {
        if (element.selecionado === true) {
          item.itemSelecionado = element;
          statusItemSelecionado = true;
        }
      });
      if (!statusItemSelecionado) { this.service.mostrarMensagem('Selecione o item de pagamento'); return; }
    }

    item.valor = this.form.value.valor;

    console.log(item);

    this.bagServ.addFp(item);
    this.dialogRef.close();
  }

  itensFp(item: any, itempay) {
    console.log(item);
    let cont = 0;
    let indexArray = 0;

    this.data.itens.forEach(element => {
      element.selecionado = false;
    });

    this.data.itens.forEach(element => {
      if (element.id === itempay.id) {
        indexArray = cont;
      }
      cont++;
    });
    setTimeout(() => { this.data.itens[indexArray].selecionado = true; }, 100);
  }

}