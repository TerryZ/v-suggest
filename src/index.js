import suggest from './Suggest';

const Plugin = {
    install(Vue, option = {}){
        Vue.component(suggest.name, suggest);
    }
};

export default Plugin;