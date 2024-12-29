const asyncHandler= require("express-async-handler");
const Contact= require("../models/contactModel")
//@desc get all contacts
//@ GET /api/contacts
// @private

const getContacts= asyncHandler(async(req,res) =>{
    const contacts=await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts)
});

//@desc get single contact
//@ GET /api/contacts/:id
// @private

const getContact= asyncHandler(async(req,res) =>{
    const contact= await Contact.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
        throw new Error("Contact Not Found")
    }
    res.status(200).json(contact);
});

//@desc create a contact
//@ POST /api/contacts
// @private
const createContact= asyncHandler(async(req,res) =>{
    console.log('the data coming from client side is ' ,req.body);
    const {name,email,phone}=req.body;
    if(!name || !phone || !email)
    {
        res.status(400);
        throw new Error("All fields are mandatory");
        
    }
    const contact= await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    })
    res.status(201).json(contact);
});

//@desc update a contact
//@ PUT /api/contacts
// @private
const updateContact= asyncHandler(async(req,res) =>{
    const contact= await Contact.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
        throw new Error("Contact Not Found, hence can't update ")
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("user don't have permisssion to update other user contacts ")
    }
    const updatedContact=await Contact.findByIdAndUpdate(req.params.id,req.body,{new : true});
    res.status(201).json(updatedContact);
});
//@desc delete a contact
//@ DELETE /api/contacts
// @private 
const deleteContact= asyncHandler(async(req,res) =>{
    const contact= await Contact.findById(req.params.id);
    if(!contact)
    {
        res.status(404);
        throw new Error("Contact Not Found, hence can't delete ");
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("user don't have permisssion to delete other user contacts ")
    }
    await Contact.deleteOne({_id:req.params.id});
    res.status(200).json(contact);

});




module.exports= {getContacts, getContact, createContact, updateContact,deleteContact}