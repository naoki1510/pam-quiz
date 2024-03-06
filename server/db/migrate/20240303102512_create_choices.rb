class CreateChoices < ActiveRecord::Migration[7.1]
  def change
    create_table :choices do |t|
      t.references :question, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.string :image
      t.integer :display_order
      t.boolean :is_correct

      t.timestamps
    end
  end
end
