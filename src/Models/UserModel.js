// models/UserModel.js
import { urlImage } from 'src/utils/config';

class UserModel {
  constructor({
    id,
    firstname,
    lastname,
    email,
    mobile,
    role,
    status,
    avatar,
    net_salary,
    username,
    created_at,
    updated_at,
    email_verified_at,
    agencescode
  }) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.mobile = mobile;
    this.role = role;
    this.status = status;
    this.avatar = avatar;
    this.net_salary = net_salary;
    this.username = username;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.email_verified_at = email_verified_at;
    this.agencescode = agencescode;
  }

  // Méthode pour obtenir le rôle en fonction de l'ID du rôle
  getUserRole() {
    switch (this.role) {
      case 1:
        return 'admin';
      case 2:
        return 'vendor';
      case 3:
        return 'client';
      default:
        return '';
    }
  }

  // Méthode pour obtenir l'URL de l'avatar de l'utilisateur
  getUserAvatar() {
    return this.avatar ? `${urlImage}${this.avatar}` : '/images/avatars/1.png';
  }

  getFullName() {
    return `${this.firstname} ${this.lastname}`;
  }
}

export default UserModel;
