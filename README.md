# csvExport

Export your HTML tables to CSV format.

### Doc

* **Installation**

Simply import JQuery & csvExport into your HTML.
```
<script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
<script src="https://unpkg.com/csvexporter@1.4.0/csvExport.min.js"></script>	
```
* **How to use**
Select your table(s) with a JQuery selector.
```
$('table').csvExport();
```
* **Options**
```
{
    escapeContent:true, //Escapes illegal chars
    title:'Exported_Table.csv', //File name
    beforeStart : function(table) {}, //Triggers before anything is called
    onStringReady : function(currentString) {} //Triggers when your CSV string is ready
}
```
* **Example**
```
$('table').csvExport({
  title: "Table_Test.csv",
  beforeStart: function(t){
    console.log(t);
  },
  onStringReady: function(s){
    console.log(s);
  }
});
```

## Authors

* **Zenoo** - *Initial work* - [Zenoo.fr](http://zenoo.fr)
