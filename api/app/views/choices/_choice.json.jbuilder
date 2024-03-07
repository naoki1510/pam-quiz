json.extract! choice, :id, :title, :description, :image, :question_id
json.is_correct choice.is_correct if @is_show_correct
json.answers do
  json.array! choice.answers, partial: 'answers/answer', as: :answer
end