import suggest from './Suggest';

const Plugin = {
    install(Vue, options = {}){
        if(Object.keys(options).length){
            if(typeof options.placeholder === 'string') suggest.props.placeholder.default = options.placeholder;
        }

        Vue.component(suggest.name, suggest);
    }
};

export default Plugin;