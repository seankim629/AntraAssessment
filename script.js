import './style.css';

const Api = (() => {
  const fetchProfile = async () => {
    var final = [];
    for (let i = 0; i < 20; i++) {
      const response = await fetch('https://randomuser.me/api').then((api) =>
        api.json()
      );
    //   console.log(response);
      final.push(response);
    }
    // const res = Promise.all([
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    //   fetch('https://randomuser.me/api'),
    // ]);
    // const data = Promise.all(res.map((r) => r.json()));

    // console.log(data);
    // data.forEach(function (arrayItem) {
    //   const temp = arrayItem.results;
    //   temp.forEach(function (content) {
    //     const fullname = content.name.title + ' ' + content.name.first;
    //     const email = content.email;
    //     const phone = content.phone;
    //     const pictureL = content.picture.large;
    //     const pictureS = content.picture.medium;
    //     const dob = content.dob;
    //     const resouse =
    //       'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    //     const length = 12;
    //     let id = '';
    //     for (let i = 0; i <= length; i++) {
    //       const index = Math.floor(Math.random() * resouse.length);
    //       id += resouse[index];
    //     }
    //     const uid = id;
    //   });
    //   final.push(
    //     new model.Useritem(fullname, email, phone, pictureL, pictureS, dob, uid)
    //   );
    // });
    return final;
  };

  return {
    fetchProfile,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ View ~~~~~~~~~~~~~~~~~~~
const View = (() => {
  const domstr = {
    dob: '.clicked',
  };

  const render = (ele, tmp) => {
    ele.innerHTML = tmp;
  };

  const createTmp = (arr) => {
    let tmp = '';

    arr.forEach((profile) => {
      if (!profile.clicked) {
        tmp += `<li>
                  <div class="card">
                    <div class="img">
                      <img src="${profile.pictureS}">
                    </div>
                    <div class="info">
                      <p>name: ${profile.fullname}<br>
                      email: ${profile.email}<br>
                      phone: ${profile.phone}</p>
                      <button class="clicked" id=${profile.id}>Show Dob</button>
                    </div>
                  </div>
                </li>`;
      } else {
        tmp += `<li>
            <div class="card">
              <div class="img">
                <img src="${profile.pictureS}">
              </div>
              <div class="info">
                <p>name: ${profile.fullname}<br>
                email: ${profile.email}<br>
                phone: ${profile.phone}</p>
                <div class="unclicked" id=${profile.id}>
                  Birthday: ${profile.dob}
                </div>
              </div>
            </div>
          </li>`;
      }
    });

    return tmp;
  };

  return {
    render,
    createTmp,
    domstr,
  };
})();

// * ~~~~~~~~~~~~~~~~~~~ Model ~~~~~~~~~~~~~~~~~~~
const Model = ((api, view) => {
  const { fetchProfile } = api;

  class Profile {
    constructor(fullname, phone, email, dob, pictureS, pictureL, uid) {
      this.fullname = fullname;
      this.phone = phone;
      this.email = email;
      this.dob = dob;
      this.pictureS = pictureS;
      this.pictureL = pictureL;
      this.id = uid;
      this.clicked = false;
    }
  }

  class State {
    #profiles = [];

    get profiles() {
      return this.#profiles;
    }
    set profiles(newprofiles) {
      this.#profiles = newprofiles;
      const all = document.getElementById('profiles');
      const tmp = view.createTmp(this.#profiles);
      view.render(all, tmp);
    }

    updateProfiles(profile) {
      const i = this.#profiles.indexOf(profile);
      this.#profiles[i] = profile;
      const all = document.getElementById('profiles');
      const tmp = view.createTmp(this.#profiles);
      view.render(all, tmp);
    }
  }

  return {
    fetchProfile,
    State,
    Profile,
  };
})(Api, View);

// * ~~~~~~~~~~~~~~~~~~~ Controller ~~~~~~~~~~~~~~~~~~~
const Controller = ((model, view) => {
  const state = new model.State();

  const init = async () => {
    const profiles = [];
    const data = await model.fetchProfile();
    // console.log(data);
    for (let i = 0; i < 20; i++) {
      const elem = data[i];
      const fullname =
        elem.results[0].name.title + ' ' + elem.results[0].name.first;
      const email = elem.results[0].email;
      const phone = elem.results[0].phone;
      const pictureL = elem.results[0].picture.large;
      const pictureS = elem.results[0].picture.medium;
      const dob = elem.results[0].dob.date;
      const resouse =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';

      const length = 12;
      let uid = '';
      for (let i = 0; i <= length; i++) {
        const index = Math.floor(Math.random() * resouse.length);
        uid += resouse[index];
      }
      profiles.push(
        new model.Profile(fullname, phone, email, dob, pictureS, pictureL, uid)
      );
    }
    state.profiles = profiles;
  };

  const reload = () => {
    const event = document.getElementById('reload');
    event.addEventListener('click', (e) => {
      location.reload();
    });
  };

  const buttonClick = () => {
    const profiles = document.getElementById('profiles');
    profiles.addEventListener('click', (event) => {
      if (
        event.target.className === 'clicked' ||
        event.target.className === 'unclicked'
      ) {
        const curr = state.profiles.filter(
          (profile) => profile.id == event.target.id
        );
        let profile = curr[0];
        if (profile.clicked) {
          profile.clicked = false;
        } else {
          profile.clicked = true;
        }
        state.updateProfiles(profile);
      }
    });
  };

  const bootstrap = () => {
    init();
    reload();
    buttonClick();
  };

  return { bootstrap };
})(Model, View);

Controller.bootstrap();
