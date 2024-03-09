class AddOpenAnswerAtToQuestion < ActiveRecord::Migration[7.1]
  def change
    add_column :questions, :open_answer_at, :timestamp
  end
end
