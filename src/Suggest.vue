<template>
    <div :name="name">
        <input type="text" v-model.trim="text" :placeholder="placeholder" :disabled="disabled" ref="input"
               @keyup="processKey"
               @keydown="processControl"
               @focus="open" >
        <div class="sg-clear"
             @click="clear"
             v-show="text"
             v-if="!disabled">
            <span>×</span>
        </div>

        <v-drop-down ref="drop" :re-open="false" :animated="false" @show-change="showChange">
            <ul class="sg-results" :style="{width: width+'px'}" ref="list" >
                <li :key="index" v-for="(row,index) in list"
                    :class="['sg-results__row',{'sg-over': highlight === index}]"
                    @click="selectItem(row)"
                    @mouseenter="highlight = index"
                    @mouseleave="highlight = -1"
                    v-html="getRow(row)" ></li>
            </ul>
        </v-drop-down>
    </div>
</template>

<script>
    import drop from 'v-dropdown';
    export default {
        name: "v-suggest",
        components: { 'v-drop-down': drop },
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
            },
            placeholder: String,
            delay: {
                type: Number,
                default: 0.2
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                text: typeof(this.value) === 'undefined'?'':this.value,
                list: [],
                highlight: -1,
                width: 0,
                dropShow: false,
                last: null,
                lastInputTime: -1
            };
        },
        methods: {
            open(){
                if(this.disabled) return;
                this.populate();
                if(!this.dropShow && this.list.length) this.$refs.drop.$emit('show', this.$refs.input);
                this.adjust();
            },
            close(){
                if(this.dropShow) this.$refs.drop.$emit('show');
                this.highlight = -1;
            },
            clear(){
                this.text = '';
                this.populate();
                this.inputFocus();
            },
            inputFocus(){
                this.$refs.input.focus();
            },
            getRow(row){
                if(typeof this.showField === 'string') return row[this.showField];
                else if(typeof this.showField === 'function') return this.showField(row);
            },
            showChange(val){
                this.dropShow = val;
                if(!val) this.highlight = -1;
            },
            processKey(e){
                if ([38, 40, 27, 13, 9].includes(e.keyCode)) return;
                this.lastInputTime = e.timeStamp;
                setTimeout(()=>{
                    if((e.timeStamp - this.lastInputTime) === 0) {
                        this.populate();
                        this.checkOpen();
                    }
                }, this.delay * 1000);
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
                        case 13:// enter
                            if(this.highlight !== -1) this.selectItem(this.list[this.highlight]);
                            break;
                        case 27:// escape
                            this.close();
                            break;
                    }
                }
            },
            selectItem(row){
                this.text = this.getRow(row);
                this.$emit('values', row);
                this.close();
            },
            next(){
                if(!this.dropShow) this.open();
                if(this.highlight < (this.list.length-1)) {
                    this.highlight++;
                    this.$nextTick(()=>{
                        let cur = this.$refs.list.querySelectorAll('.sg-over')[0],
                            curPos = cur.getBoundingClientRect(),
                            listPos = this.$refs.list.getBoundingClientRect(),
                            dist = (this.$refs.list.scrollTop + curPos.bottom) - listPos.bottom;
                        if(dist) this.$refs.list.scrollTop = dist;
                    });
                }
            },
            previous(){
                if(this.highlight === 0) return;
                if(!this.dropShow) this.open();
                this.highlight = this.highlight === -1 ? this.list.length - 1 : --this.highlight;
                this.$nextTick(()=>{
                    let cur = this.$refs.list.querySelectorAll('.sg-over')[0],
                        curPos = cur.getBoundingClientRect(),
                        listPos = this.$refs.list.getBoundingClientRect(),
                        dist = curPos.top - listPos.top;
                    if(dist < 0) this.$refs.list.scrollTop += dist;
                });
            },
            checkOpen(){
                this.list.length ? this.open() : this.close();
            },
            adjust(){
                let inputWidth = this.$refs.input.getBoundingClientRect().width;

                //minimize width 200px
                if(this.width === 198) {
                    if(inputWidth > 198) this.width = inputWidth;
                }else{
                    if((inputWidth - 2) !== this.width) this.width = (inputWidth > 200 ? inputWidth : 200) - 2;
                }
            },
            populate(){
                if(Array.isArray(this.data) && this.data.length){
                    if(this.text !== this.last){
                        this.list = this.text ? this.data.concat().filter(value=>{
                            let result = this.getRow(value).toLowerCase();
                            return String(result).includes(this.text.toLowerCase());
                        }) : [];
                    }
                    this.last = this.text;
                }
            }
        },
        watch: {
            value(val){
                this.text = val;
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
            this.adjust();
        }
    }
</script>

<style lang="scss">
div.v-suggest{
    position: relative;
    input[type="text"] {
        display: block;
        width: 100%;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #333;
        background-color: #fafafa;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: none;
        box-shadow: none;
        will-change: border-color, box-shadow, background-color;
        -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s, background-color ease-in-out .15s;
        -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s, background-color ease-in-out .15s;
        transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s, background-color ease-in-out .15s;
        outline: 0;
        &::-webkit-input-placeholder{ color:#aaa; }
        &:hover { background-color: #f5f5f5; }
        &:focus{
            border: 1px solid #999;
            border-radius: 2px;
            -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            background-color: #fff;
            color: black;
        }
        &[disabled] { background-color: #eee;color: #666;cursor: not-allowed; }
    }
    div.sg-clear {
        position: absolute;
        right: 10px;
        top: 0;
        cursor: pointer;
        height: 100%;
        width: auto;
        line-height: 1;
        padding: 6px 0;
        font-size: 21px;
        color: #999;
        span{ display: inline-block; }
        &:hover { color: #000; }
    }
}
ul.sg-results {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";;
    min-width: 250px;
    max-height: 300px;
    overflow-y: auto;
    padding: 5px 0;
    margin: 0;
    li.sg-results__row {
        height: auto !important;
        line-height: 1.4;
        margin: 0;
        overflow: hidden;
        padding: 5px 10px;
        position: relative;
        text-align: left;
        /*white-space: nowrap;*/
        white-space: normal;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        cursor: default;
        &.sg-over {
            background-color: #53A4EA !important;color: #fff !important;cursor: pointer;
        }
    }
}
</style>