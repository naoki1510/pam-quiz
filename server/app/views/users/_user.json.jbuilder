json.extract! user, :id, :name, :rank, :point
json.answers do
  json.array! user.answers, partial: 'answers/answer', as: :answer
end