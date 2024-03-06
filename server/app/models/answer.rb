class Answer < ApplicationRecord
  belongs_to :user
  belongs_to :choice
  has_one :question, through: :choice

  scope :correct, -> { joins(:choice).where(choices: { is_correct: true }) }
end
