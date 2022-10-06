const Category = require('../../models/category');
const Product = require('../../models/product');
const Order = require("../../models/order");

function createCategories(categories,parentId = null){
    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined);
    }else{
        category = categories.filter(cat => cat.parentId == parentId);
    }
    for(let cate of category){
        categoryList.push({
            _id:cate._id,
            name:cate.name,
            slug: cate.slug,
            parentId:cate.parentId,
            type:cate.type,
            children: createCategories(categories,cate._id)
        })
    }

    return categoryList;
}

// exports.initialData = async (req,res) => {

//     const categories = await Category.find({}).exec();
//     const products = await Product.find({})
//     .select('_id name price quantity slug description productPictures category')
//     .populate({
//         path: 'category' , select: '_id name'
//     })
//     .exec();

//     // Important example that how we can map foreign key,
//     // here we map product table with category 
//     // in product table we have category id we select it first from the product table 
//     // and then we have used populate function to get the data of category based on id
//     //  this how foreign key concept work in mongoose
//     // const products = await Product.find({})
//     // .select('_id name category')
//     // .populate('category').exec();

//     res.status(200).json({
//         categories:createCategories(categories),
//         products
//     })

// }

exports.initialData = async (req, res) => {
    const categories = await Category.find({}).exec();
    const products = await Product.find({ createdBy: req.user._id })
      .select("_id name price quantity slug description productPictures category")
      .populate({ path: "category", select: "_id name" })
      .exec();
    const orders = await Order.find({})
      .populate("items.productId", "name")
      .exec();
    res.status(200).json({
      categories: createCategories(categories),
      products,
      orders,
    });
  };