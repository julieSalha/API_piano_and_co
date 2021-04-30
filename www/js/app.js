// Admin actions
const createComment = (id, content) => { 
    console.log('createComment', event)
    new FETCHrequest(
        `/comment`,
        'POST',
        {
            content : content,
            subjectOf: id,
            author : idUser
        }
    )
    .sendRequest()
    .then( jsonData => console.log(jsonData))
    .catch( jsonError => console.log(jsonError));
};

const deleteComment = (id)  => { 
    new FETCHrequest(
        `/comment/${id}`,
        'DELETE',
        {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true,
        },
    )
    .sendRequest()
    .then( dataDelete => {
        console.log(dataDelete);
    })
    .catch( dataError => console.log(dataError))
};

const toggleLike = (event, id) => {
    if (!event.target.classList.contains('active')) {
        new FETCHrequest(
            `/like`,
            'POST',
            {
                potentialAction : 'Like',
                subjectOf: id,
                author : idUser
            }
        )
        .sendRequest()
        .then( jsonData => console.log(jsonData))
        .catch( jsonError => console.log(jsonError));
    } else {
    new FETCHrequest(
        `/like/${id}`,
        'DELETE',
        {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true,
        },
    )
    .sendRequest()
    .then( dataDelete => {
        console.log(dataDelete);
    })
    .catch( dataError => console.log(dataError))
    }
    event.target.classList.toggle('active');
}
