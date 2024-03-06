class ChoicesController < ApplicationController
  before_action :set_choice, only: %i[ show update destroy ]

  # GET /choices
  def index
    @choices = Choice.all.ordered
  end

  # GET /choices/1
  def show
    render json: @choice
  end

  # POST /choices
  def create
    @choice = Choice.new(choice_params)

    if @choice.save
      render json: @choice, status: :created, location: @choice
    else
      render json: @choice.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /choices/1
  def update
    if @choice.update(choice_params)
      render json: @choice
    else
      render json: @choice.errors, status: :unprocessable_entity
    end
  end

  # DELETE /choices/1
  def destroy
    @choice.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_choice
      @choice = Choice.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def choice_params
      params.require(:choice).permit(:question_id, :title, :description, :image, :is_correct, :display_order)
    end
end
