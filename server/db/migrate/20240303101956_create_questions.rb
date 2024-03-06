class CreateQuestions < ActiveRecord::Migration[7.1]
  def change
    create_table :questions do |t|
      t.string :title
      t.string :image
      t.string :question_type
      t.integer :point
      t.integer :display_order
      t.timestamp :started_at
      t.timestamp :ended_at

      t.timestamps
    end
  end
end
