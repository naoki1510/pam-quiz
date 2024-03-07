class Question < ApplicationRecord
  has_many :choices, dependent: :destroy
  has_many :answers, through: :choices
  has_many :users, through: :answers

  scope :ordered, -> { order(display_order: :asc) }
  scope :active, -> { where("started_at <= ? AND ? < ended_at", Time.current, Time.current) }
  scope :finished, -> { where("ended_at <= ?", Time.current).order(ended_at: :desc)}
  scope :last_finished, -> { finished.limit(1) }

  def correct_answers
    answers.where(choice_id: correct_choices.ids)
  end

  def finished?
    ended_at.present? && ended_at <= Time.current
  end

end