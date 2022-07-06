import {db} from "../utils/init-firebase";

//const db = database.ref("/presentation");

class PresentationDataService {
  getAll() {
    return db;
  }

  create(presentation) {
    return db.push(presentation);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }
}

export default new PresentationDataService();