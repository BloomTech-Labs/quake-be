const db = require('../database/dbConfig')
module.exports = {
    add, 
    find,
    findById,
    update,
    remove
}

function find(username){
    let query = db('users')
    if(username){
        query = db('users').where({ username }).first()
    }
    return query
}
function findById(id){
    return db('users').where({id}).first()
}
function add(users){
    return db('users').insert(user)
}
function update(id, changes){
    return db('users').update(changes).where({id})
    
}
function remove(id){
    return db('users').where({id}).del()
}