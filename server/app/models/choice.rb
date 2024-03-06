class Choice < ApplicationRecord
  belongs_to :question
  has_many :answers, dependent: :destroy
  has_many :users, through: :answers

  scope :ordered, -> { order(display_order: :asc) }
end
