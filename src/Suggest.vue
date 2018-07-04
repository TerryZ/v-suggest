<template>
    <div :name="name">
        <input type="text" v-model.trim="text"
               @keyup="processKey"
               @keydown="processControl"
               @focus="populate"
               ref="input">

        <v-dropdown ref="drop" @show-change="dropdownVisible">
            <div class="sg-results" :style="{width: width+'px'}" ref="list">
                <div v-for="row,index in list"
                     :class="{'sg-over':highlight === index}"
                     @mouseenter="highlight=index"
                     @click="selectItem(row)"
                     v-html="getRow(row)"></div>
            </div>
        </v-dropdown>
    </div>
</template>

<script>
    import drop from './Dropdown'
    export default {
        name: "v-suggest",
        components: { 'v-dropdown': drop },
        props: {
            data: Array,
            value: String,
            name:String,
            keyField: {
                type: String,
                default: 'id'
            },
            showField: {
                type: [String, Function],
                default: 'name'
            }
        },
        data(){
            return {
                text: typeof(this.value) === 'undefined'?'':this.value,
                list: [],
                highlight: -1,
                width: '',
                show: false,
                last: null,
                selected: null
            };
        },
        methods: {
            open(){
                if(!this.list.length) this.populate();
                this.$nextTick(()=>{
                    //if(this.disabled) return;
                    if(!this.show) this.show = true;
                    //else this.inputFocus();
                });
            },
            close(){
                this.$refs.drop.$emit('show', false);
                this.highlight = -1;
            },
            inputFocus(){
                this.$refs.input.focus();
            },
            getRow(row){
                let result = '';
                if(typeof(this.showField) === 'string') result = row[this.showField];
                else if(typeof(this.showField) === 'function') result = this.showField(row);
                return result;
            },
            dropdownVisible(val){
                this.show = val;
            },
            processKey(e){
                if (![38, 40, 27, 13, 9].includes(e.keyCode)) this.populate();
            },
            processControl(e){
                if ([38, 40, 27, 13, 9].includes(e.keyCode)) {
                    switch (e.keyCode) {
                        case 38:// up
                            this.previous();
                            break;
                        case 40:// down
                            this.next();
                            break;
                        case 9: // tab
                        case 13:// return
                            if(this.highlight !== -1) this.selectItem(this.list[this.highlight]);
                            break;
                        case 27:// escape
                            this.close();
                            break;
                    }
                }
            },
            selectItem(row){
                let result = this.getRow(row);
                this.text = result;
                this.selected = result;

                this.close();
            },
            next(){
                this.open();
                if(this.highlight < (this.list.length-1)) {
                    //this.populate();
                    this.highlight++;


                    let that = this;
                    this.$nextTick(()=>{
                        let cur = that.$refs.list.querySelectorAll('div.sg-over')[0],
                            curPos = cur.getBoundingClientRect(),
                            listPos = that.$refs.list.getBoundingClientRect(),
                            dist = (that.$refs.list.scrollTop + curPos.bottom) - listPos.bottom;
                        if(dist) that.$refs.list.scrollTop = dist;
                    });
                }
            },
            previous(){
                if(this.highlight > 0) {
                    //this.populate();
                    this.highlight--;
                    let that = this;
                    this.$nextTick(()=>{
                        let cur = that.$refs.list.querySelectorAll('div.sg-over')[0],
                            curPos = cur.getBoundingClientRect(),
                            listPos = that.$refs.list.getBoundingClientRect(),
                            dist = curPos.top - listPos.top;
                        if(dist < 0) that.$refs.list.scrollTop += dist;
                    });
                }
            },
            populate(){
                if(Array.isArray(this.data) && this.data.length){
                    //if(this.text){
                        let that = this, val = '';
                        if(this.text === this.selected) val = '';
                        else val = this.text;
                        if(this.text !== this.last){
                            this.list = this.data.concat().filter(value=>{
                                let result = that.getRow(value).toLowerCase();
                                return String(result).includes(val.toLowerCase());
                            });
                        }
                        let info = this.$refs.input.getBoundingClientRect();
                        this.width = (info.width > 200 ? info.width : 200) - 2;
                        that.last = this.text;
                        if(this.list.length) this.open();
                        else this.close();
                    //}else{
                    //    this.close();
                    //}
                }
            }
        },
        watch: {
            show(val) {
                if (val) {
                    let that = this;
                    this.$refs.drop.$emit('show', true, this.$refs.input);
                }
            },
            text(val){
                this.$emit('input', val);
            }
        },
        mounted(){
            let tmpClass = this.$el.className;
            this.$el.className = 'v-suggest';
            this.$refs.input.className = tmpClass;

            //this.populate();
        }
    }
</script>

<style lang="scss" scoped>
div.v-suggest{
    input[type="text"] {
        display: block;
        width: 100%;
        height: 34px;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: none;
        box-shadow: none;
        -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
        outline: 0;
        &:focus{
            border: 1px solid #999;
            border-radius: 2px;
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
        }
    }
}
div.sg-results {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";;
    min-width: 250px;
    max-height: 300px;
    overflow-y: auto;
    div {
        height: auto !important;
        line-height: 1;
        margin: 0;
        overflow: hidden;
        padding: 4px 8px;
        position: relative;
        text-align: left;
        white-space: nowrap;
        font-size: 14px;
        color: #333;
        &.sg-over {
            background-color: #53A4EA !important;color: #fff !important;cursor: pointer;
        }
    }
}
</style>