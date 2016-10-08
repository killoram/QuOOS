# QuOOS 
( Quick Object Oriented Storage )

QuOOS uses KVPS to make temporarily storing and managing large (or small) sets of objects REALLY QUICK and REALLY EASY.

Create a whole temporary storage system in one short line of code:
```js
var notes = new QuOOS();
```

If you'd like, you can even assign a specific name to the system:
```js
var notes = new QuOOS("myNotes");
```

# QuOOS Methods

Here are a list of the QuOOS methods:

Function                                    | Returns           | Description 
------------------------------------------- | ----------------- | --------------------------------------------------------------------
add(OBJECT)                                 | undefined         | Stores an object in the datasection
edit(whereThis,equalsThis,setThis,toThis)   | undefined         | Changes a property's value of any object who's given property equals the given value.
remove(whereThis,equalsThis)                | undefined         | Removes any object who's given property equals the given value.
get(whereThis,equalsThis)                   | object            | Returns the object who's given property equals the given value.
clear()                                     | undefined         | Deletes all stored data
listAll()                                   | array of objects  | Returns all stored objects in the dataSection
where(whereThis,equalsThis)                 | array of objects  | Returns all objects who's given property equals the given value.
filter(evaluations)                         | array of objects  | Runs evaluation(s) against every object in the dataSection. Every object where the evaluation(s) are true are returned. NOTE the evaluations parameter takes an array of evals as strings( ["expression"] ) and properties are referenced simply by using "object": Example... object.name!==null

Examples...

```js
var memory = QuOOS("memories");

memory.add({
  propertyName: "value"
  otherProperty: "other value"
});

//Change the object who's property "propertyName" equals "value" by setting its property "otherProperty" to "Other Value"
memory.edit("propertyName", "value", "otherProperty", "Other Value");

//Where "propertyName" equals "value" delete that object
memory.remove("propertyName", "value");

//Where "propertyName" equals "value" return that object
var m = memory.get("propertyName", "value");

//Delete all stored objects
memory.clear();

//Return all stored objects
memory.listAll();

//Return all objects where "propertyName" equals "value"
memory.where("propertyName", "value");

//Return all objects where "propertyName" isn't equal to null and the "propertyName" value is shorter than the "otherProperty".
memory.filter([
  "object.propertyName!=null",
  "object.propertyName.length < object.otherProperty.length"
]);
```
