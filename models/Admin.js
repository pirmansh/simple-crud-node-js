const db = require('../util/database');

module.exports = class Admin {
    constructor(email, password, fullname, image, role) {
      this.email      = email;
      this.password   = password;
      this.fullname   = fullname;
      this.image      = image;
      this.role       = role;
    }

    save(){
        return db.execute(
          'INSERT INTO admin (email, password, fullname, image, role) VALUES (?, ?, ?, ?, ?)', 
          [this.email, this.password, this.fullname, this.image, this.role]);
      }
      static fetchAll(){
        return db.execute('SELECT * FROM admin');

      }
      // edit admin
      static update(fullname, role, id){
        return db.execute('UPDATE admin SET fullname = ?, role = ? WHERE admin.id = ?',
        [fullname, role, id]);
  
      }
      // edit image
      static updateImage(image, id){
        return db.execute('UPDATE admin SET image = ? WHERE admin.id = ?', [image, id]);
  
      }
      // edit profile
      static editProfile(password, fullname, id){
        return db.execute('UPDATE admin SET password = ?, fullname = ? WHERE admin.id = ?', [
          password, fullname, id
        ]);
  
      }
  
      static resetPassword(password, id){
        return db.execute('UPDATE admin SET password = ? WHERE admin.id = ?', [
          password, id
        ]);
  
      }
  
      static cekEmail(email){
        return db.execute('SELECT * FROM admin WHERE email = ?', [email])
  
      }
      
      static getAdminById(id){
        return db.execute('SELECT * FROM admin WHERE admin.id = ?', [id])

      }

      static delete(id){
        return db.execute('DELETE FROM admin WHERE admin.id = ?', [id]);
        
      }
  
}