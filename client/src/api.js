//const path = `${process.env.PORT}`;
const path = 'http://localhost:3000';

const login = async (credentials) => {

    const response = await fetch(`${path}/api/authenticate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    })
        .then((res) => res.json())
        .then((data) => {
            if(data.ok) {
                return data;
            } else {
                throw new Error('Login error');
            }            
        })
        .catch(err => console.log(err));

    return response;
}

const signup = async (credentials) => {

    const response = await fetch(`${path}/api/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.ok) {
                return data;
            } else {
                throw new Error('Duplicate email');
            }
        })
        .catch(err => {
            throw new Error('Duplicate email');
        });
    return response;
}

const getUserInfo = async () => {

    const response = await fetch(`${path}/api/getUserInfo`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return await response.json();
}

const savePlan = async (credentials) => {

    const response = await fetch(`${path}/api/savePlan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify(credentials),
        })
        .catch(err => {
            throw new Error('Error saving plan.');
        });
    return response;
}

const getUserPlans = async () => {

    const response = await fetch(`${path}/api/getUserPlans`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return await response.json();
}

const getPublicPlans = async (coach) => {

    const response = await fetch(`${path}/api/getPublicPlans`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return await response.json();
}

const deletePlan = async (id) => {
    return await fetch(`${path}/api/deletePlan/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
}

const changePlanPublicity = async (data) => {

    const response = await fetch(`${path}/api/changePlanPublicity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(data),
    });
    return await response.json();
}

const buyPlan = async (data) => {

    const response = await fetch(`${path}/api/buyPlan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(data),
    });
    return await response.json();
}

const selectCurrentPlan = async (planId) => {

    const response = await fetch(`${path}/api/selectCurrentPlan/${planId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return await response.json();
}

const removeCurrentPlan = async (planId) => {

    await fetch(`${path}/api/removeCurrentPlan/${planId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
}

const getCurrentPlans = async (coach) => {

    const response = await fetch(`${path}/api/getCurrentPlans`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json',  Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return await response.json();
}

const getSales = async () => {

    const response = await fetch(`${path}/api/getSales`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return await response.json();
}

const addMilestone = async (data) => {

    const response = await fetch(`${path}/api/addMilestone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(data),
    });
    return await response.json();
}

const deleteMilestone = async (id) => {
    return await fetch(`${path}/api/deleteMilestone/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
}

const addChallenge = async (data) => {

    const response = await fetch(`${path}/api/addChallenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(data),
    });
    return await response.json();
}

const getChallenges = async () => {

    const response = await fetch(`${path}/api/getChallenges`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return await response.json();
}

const finishChallenge = async (data) => {

    const response = await fetch(`${path}/api/finishChallenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}`  },
        body: JSON.stringify(data),
    });
    return await response.json();
}

const updateRanking = async (data) => {

    const response = await fetch(`${path}/api/updateRanking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(data),
    });
    return await response.json();
}

const getRankings = async () => {

    const response = await fetch(`${path}/api/getRankings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return await response.json();
}

const uploadPicture = async (file) => {
    let formData = new FormData();
    formData.append('file', file);
    return await fetch(`${path}/api/uploadPicture`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: formData,
    })
}

const getPictures = async () => {
    const response = await fetch(`${path}/api/pictures`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    return await response.json();
}

const deletePicture = async (id) => {
    return await fetch(`${path}/api/pictures/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
}

export {
    login,
    signup,
    getUserInfo,
    savePlan,
    deletePlan,
    getUserPlans,
    getPublicPlans,
    getCurrentPlans,
    selectCurrentPlan,
    removeCurrentPlan,
    changePlanPublicity,
    buyPlan,
    getSales,
    addMilestone,
    deleteMilestone,
    addChallenge,
    updateRanking,
    finishChallenge,
    getRankings,
    getChallenges,
    uploadPicture,
    getPictures,
    deletePicture,
};