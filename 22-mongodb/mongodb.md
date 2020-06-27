## Relational Database Management System VS MongoDB 
| RDBMS | MongoDB |
| --------- | -----:|
| Database | Database |
| Table | Collection |
| Tuple/Row | Document |
| column | Field |
| Table Join	| Embedded Documents |
| Primary Key	| Primary Key (Default key _id provided by MongoDB itself) |

## Useful MongoDB

#### Create Database
```
use DATABASE_NAME

>use mydb
switched to db mydb
>show dbs
local     0.78125GB
test      0.23012GB
```

#### Drop Database
```
db.dropDatabase()

>show dbs
local      0.78125GB
mydb       0.23012GB
test       0.23012GB

>use mydb
switched to db mydb
>db.dropDatabase()
>{ "dropped" : "mydb", "ok" : 1 }

>show dbs
local      0.78125GB
test       0.23012GB
```

#### Create Collection
```
db.createCollection(name, options)

>use test
switched to db test
>db.createCollection("mycollection")
{ "ok" : 1 }

>show collections
mycollection
system.indexes

> db.createCollection("mycol", { capped : true, autoIndexID : true, size : 6142800, max : 10000 } ){
"ok" : 0,
"errmsg" : "BSON field 'create.autoIndexID' is an unknown field.",
"code" : 40415,
"codeName" : "Location40415"
}
```

#### Insert Document
```
> db.createCollection("post")
> db.post.insert([
	{
		title: "MongoDB Overview",
		description: "MongoDB is no SQL database",
		by: "tutorials point",
		url: "http://www.tutorialspoint.com",
		tags: ["mongodb", "database", "NoSQL"],
		likes: 100
	},
	{
	title: "NoSQL Database",
	description: "NoSQL database doesn't have tables",
	by: "tutorials point",
	url: "http://www.tutorialspoint.com",
	tags: ["mongodb", "database", "NoSQL"],
	likes: 20,
	comments: [
		{
			user:"user1",
			message: "My first comment",
			dateCreated: new Date(2013,11,10,2,35),
			like: 0
		}
	]
}
])
```

#### Query Document
```
> db.mycol.find()
{ "_id" : ObjectId("5dd4e2cc0821d3b44607534c"), "title" : "MongoDB Overview", "description" : "MongoDB is no SQL database", "by" : "tutorials point", "url" : "http://www.tutorialspoint.com", "tags" : [ "mongodb", "database", "NoSQL" ], "likes" : 100 }

# The pretty() Method
To display the results in a formatted way, you can use pretty() method.

> db.mycol.find().pretty()
{
	"_id" : ObjectId("5dd4e2cc0821d3b44607534c"),
	"title" : "MongoDB Overview",
	"description" : "MongoDB is no SQL database",
	"by" : "tutorials point",
	"url" : "http://www.tutorialspoint.com",
	"tags" : [
		"mongodb",
		"database",
		"NoSQL"
	],
	"likes" : 100
}

## findOne()

> db.mycol.findOne({title: "MongoDB Overview"})
{
	"_id" : ObjectId("5dd6542170fb13eec3963bf0"),
	"title" : "MongoDB Overview",
	"description" : "MongoDB is no SQL database",
	"by" : "tutorials point",
	"url" : "http://www.tutorialspoint.com",
	"tags" : [
		"mongodb",
		"database",
		"NoSQL"
	],
	"likes" : 100
}
```

#### Update Document
```
>db.mycol.update({'title':'MongoDB Overview'},{$set:{'title':'New MongoDB Tutorial'}})
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

>db.mycol.save(
   {
      "_id" : ObjectId("507f191e810c19729de860ea"), 
		"title":"Tutorials Point New Topic",
      "by":"Tutorials Point"
   }
)

> db.empDetails.findOneAndUpdate(
	{First_Name: 'Radhika'},
	{ $set: { Age: '30',e_mail: 'radhika_newemail@gmail.com'}}
)

# Update one
> db.empDetails.updateOne(
	{First_Name: 'Radhika'},
	{ $set: { Age: '30',e_mail: 'radhika_newemail@gmail.com'}}
)

# Update Many
> db.empDetails.updateMany(
	{Age:{ $gt: "25" }},
	{ $set: { Age: '00'}}
)
```

#### Delete Document
```
db.mycol.remove({'title':'MongoDB Overview'})
```

#### Limit Method
```
>db.mycol.find({},{"title":1,_id:0}).limit(2)
```

#### Select only the necessary data
```
>db.mycol.find({},{"title":1,_id:0})
```

#### Sort
```
>db.COLLECTION_NAME.find().sort({KEY:1})
```