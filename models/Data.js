const db = require('../util/database');

module.exports = class Data {
    constructor(no_internet, sn, status, alamat, created_at, keterangan) {
      this.no_internet      = no_internet;
      this.sn               = sn;
      this.status           = status;
      this.alamat           = alamat;
      this.created_at       = created_at;
      this.keterangan       = keterangan;
    }

    save(){
        return db.execute(
          'INSERT INTO tiket (no_internet, sn, status, alamat, created_at, keterangan) VALUES (?, ?, ?, ?, ?, ?)', 
          [this.no_internet, this.sn, this.status, this.alamat, this.created_at, this.keterangan]);
      }
      static fetchAll(){
        return db.execute('SELECT * FROM tiket');

      }

      static update(no_internet, sn, status, alamat, updated_at, keterangan, id){
        return db.execute('UPDATE tiket SET no_internet = ?, sn = ?, status = ?, alamat = ?, updated_at = ?, keterangan = ? WHERE tiket.id = ?',
        [no_internet, sn, status, alamat, updated_at, keterangan, id]);
  
      }
      
      static getById(id){
        return db.execute('SELECT * FROM tiket WHERE tiket.id = ?', [id])

      }

      static delete(id){
        return db.execute('DELETE FROM tiket WHERE tiket.id = ?', [id]);
        
      }
  
}