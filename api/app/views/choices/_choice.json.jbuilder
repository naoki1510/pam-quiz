json.extract! choice, :id, :title, :description, :image, :question_id
json.is_correct choice.is_correct if @is_show_correct
json.answer do
  json.array! choice.answers, partial: 'answers/answer', as: :answer if @is_show_answers
end