let express = require('express');
let router = express.Router();
let User = require('../../schema/user');
// const mongoose = require('mongoose');
// const userAuth = require('../../middleware/userAuth');

router.put('/api/users/:userId/update_budget', async (req, res) => {
  try {
    const { userId } = req.params;
    const { duration, budget } = req.body;
    const id = req.user;
    // if (userId !== id) {
    //   return res.status(401).json({
    //     error: 'Unauthorized user'
    //   });
    // }

    if(duration === 'weekly'){
      let newBudget= await User.findByIdAndUpdate({ _id: userId },{weekly_budget:budget})
      const user = await User.find({ _id: userId });
      return res.status(200).json({
        budget: user
      });
    }
    else if(duration === 'monthly'){
      let newBudget = await User.findByIdAndUpdate({ _id: userId },{
        monthly_budget: budget
      });
      const user = await User.find({ _id: userId });
      return res.status(200).json({
        budget: user
      });
    }
    else if(duration === 'yearly'){
      let newBudget = await User.findByIdAndUpdate({ _id: userId },{  yearly_budget: budget });
      const user = await User.find({ _id: userId });
    return res.status(200).json({
        budget: user
      });
    } else {
      return res.status(400).json({
        error: 'Please enter either weekly,monthly or yearly'
      });
    }
  } catch (error) {
    res.status(400).json({
      error: 'Error updating budget'
    });
  }
})

router.post('/api/users/:userId/setWeeklyBudget', async (req, res) => {
  try {
		const { userId } = req.params;
        const id = req.user;
        let { budget, duration } = req.body;
        // if (userId !== id) {
        //     return res.status(401).json({ error: 'Unauthorized user' });
        // }
        if (duration == "weekly") {
        	let updated_user = await User.updateOne({ _id: userId }, {weekly_budget : budget }, {upsert:true});
            res.status(200).json({
            user: updated_user,
            message: "successfully upadated"
            });
        } else {
        	return res.status(400).json({
               error: 'Duration not set to weekly'
            });
        }
  } catch (error) {
        console.log(error.message);
  }
});

router.post('/api/users/:userId/setYearlyBudget', async (req, res) => {
  try {
		const { userId } = req.params;
        const id = req.user;
        let { budget, duration } = req.body;
        // if (userId !== id) {
        //     return res.status(401).json({ error: 'Unauthorized user' });
        // }
        if (duration == "yearly") {
        	let updated_user = await User.updateOne({ _id: userId }, {yearly_budget : budget }, {upsert:true});
            res.status(200).json({
            user: updated_user,
            message: "successfully upadated"
            });
        } else {
        	return res.status(400).json({
               error: 'Duration not set to yearly'
            });
        }
  } catch (error) {
        console.log(error.message);
  }
});


router.put('/api/users/:userId/setMonthlyBudget', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { budget } = req.body;
    const id = req.user;

    // if (userId !== id) {
    //     return res.status(401).json({
    //         error: 'Unauthorized user'
    //     });
    // }
    if(duration == "monthly") {
    	await User.updateOne({ _id: userId }, { $set: { monthly_budget: budget } })
      .then(() => {
        res.status(201).json({
          message: 'Budget set successfully'
        });
      })
      .catch(error => {
        res.status(400).json({
          error: error
        });
      });
    } else {
        	return res.status(400).json({
               error: 'Duration not set to monthly'
            });
    }
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
