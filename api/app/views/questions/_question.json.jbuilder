json.extract! question, :id, :title, :image, :question_type, :point, :status, :until_end, :display_order
json.is_finished question.finished?
json.choices do
  json.array! question.choices.ordered, partial: "choices/choice", as: :choice
end
json.until_end (question.started_at + 30.seconds - Time.current) if (question.started_at.present? && question.ended_at.present? && question.started_at < Time.current && Time.current < question.ended_at)
