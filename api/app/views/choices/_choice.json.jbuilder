json.extract! choice, :id, :title, :description, :image, :question_id
json.is_correct choice.is_correct if @is_show_correct || choice.question.answer_opened?
json.answers do
  json.array! choice.answers, partial: 'answers/answer', as: :answer
end