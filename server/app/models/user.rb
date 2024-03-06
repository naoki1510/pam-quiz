class User < ApplicationRecord
  has_many :answers, dependent: :destroy
  has_many :choices, through: :answers
  has_many :questions, through: :choices

  def point
    answers.joins(:choice).where(choice: {is_correct: true}).count
  end

  def rank
    if answers.count == 0 then 
      return User.count 
    end
    User.joins(:choices).where(choices: {is_correct: true}).group(:id).having("COUNT(*) > ?", point).count.length + 1
  end
end
