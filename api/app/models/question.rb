class Question < ApplicationRecord
  has_many :choices, dependent: :destroy
  has_many :answers, through: :choices
  has_many :users, through: :answers

  before_save :set_display_order

  scope :ordered, -> { order(display_order: :asc) }
  scope :active, -> { where("started_at <= ? AND ? < ended_at", Time.current, Time.current) }
  scope :finished, -> { where("ended_at <= ?", Time.current).order(ended_at: :desc)}
  scope :last_finished, -> { finished.limit(1) }

  def correct_answers
    answers.where(choice_id: correct_choices.ids)
  end

  def active?
    started_at.present? && ended_at.present? && started_at <= Time.current && Time.current < ended_at
  end

  def finished?
    ended_at.present? && ended_at <= Time.current
  end

  def until_end
    (ended_at - Time.current) if (started_at.present? && ended_at.present? && started_at < Time.current && Time.current < ended_at)
  end

  def answer_opened?
    open_answer_at.present? && open_answer_at <= Time.current
  end

  def status
    return :answer_opened if answer_opened?
    return :finished if finished?
    return :active if active?
    :waiting
  end

  private
    def set_display_order
      self.display_order ||= Question.maximum(:display_order).to_i + 1
      if Question.where(display_order: self.display_order).where.not(id: self.id).exists?
        Question.where(display_order: self.display_order).where.not(id: self.id).update_all("display_order = display_order + 1")
      end
    end

end