class User < ApplicationRecord
  has_many :answers, dependent: :destroy
  has_many :choices, through: :answers
  has_many :questions, through: :choices

  def point
    user_point = 0
    user_point += answers.joins(:question).where(choice: {is_correct: true}, question: {question_type: :single}).sum("question.point")
    questions.where(question_type: :multiple).each do |question|
      if question.answers.where(choices: {is_correct: true}, user_id: id).count == question.choices.where(is_correct: true).count && question.answers.where(user_id: id).count == question.choices.where(is_correct: true).count
        user_point += question.point
      end
    end
    user_point
  end
end
