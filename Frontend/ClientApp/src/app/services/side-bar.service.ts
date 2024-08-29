import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SideBarService {
  private logged = new BehaviorSubject<boolean>(false);
  public customMessage = this.logged.asObservable();
  private usuario = new BehaviorSubject<string>('Invitado');
  public customusuario = this.usuario.asObservable();
  private perfil = new BehaviorSubject<string>('User');
  public customperfil = this.perfil.asObservable();
  private modulo = new BehaviorSubject<string>('');
  public currentmodule = this.modulo.asObservable();
  constructor() {}
  public changeStatus(logged: boolean, user: string, profile: string): void {
    this.logged.next(logged);
    this.usuario.next(user);
    this.perfil.next(profile);
  }

  public changeModule(module: string){
    this.modulo.next(module);
  }
}
