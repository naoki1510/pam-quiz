json.extract! user, :id, :name, :point
json.answers do
  json.array! user.answers, partial: 'answers/answer', as: :answer
end