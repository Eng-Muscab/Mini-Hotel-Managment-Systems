import { getAllCustomers, getCustomerById, manageCustomers } from "./cus.service.js";

export const customerController = (req, res) => {
    const {id} = req.params;

    try{
        switch(req.method){
            case "GET":
                if(id){
                    const customer = getCustomerById(id);
                    return customer
                        ? res.status(200).json(customer)
                        : res.status(404).json({message: "Customer not found"});
                }
                const customers = getAllCustomers();
                return res.status(200).json(customers);
            case "POST":
                const {name, phone, refrece, ref_tell} = req.body;
                if(!name || !phone){
                    return res.status(400).json({error: "Name and phone are required"});
                }
                const createRes = manageCustomers("CREATE", null, name, phone, refrece, ref_tell);
                return res.status(201).json(createRes);
            case "PUT":
                if(!id){
                    return res.status(400).json({error: "Customer ID required"});
                }
                const {name: uName, phone: uPhone, refrece: uRefrece, ref_tell: uRefTell} = req.body;
                const updateRes = manageCustomers("UPDATE", id, uName, uPhone, uRefrece, uRefTell);
                return res.status(200).json(updateRes);
            case "DELETE":
                if(!id){
                    return res.status(400).json({error: "Customer ID required"});
                }
                const deleteRes = manageCustomers("DELETE", id);
                return res.status(200).json(deleteRes);
        }
    }catch(err){
        console.log(err);
    }
} 