const db = require('../data/dbConfig')
module.exports = {
    add, 
    find,
    findById,
    update,
    remove
}

function find(username){
    let query = db('user')
    if(username){
        query = db('user').where({ username }).first()
    }
    return query
}
function findById(id){
    return db('user').where({id}).first()
}
function add(user){
    return db('user').insert(user)
}
function update(id, changes){
    return db('user').update(changes).where({id})
    
}
function remove(id){
    return db('user').where({id}).del()
}