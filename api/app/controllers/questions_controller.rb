class QuestionsController < ApplicationController
  before_action :set_question, only: %i[ show update destroy start end ]
  before_action :set_show_correct, only: %i[ index show start end ]

  # GET /questions
  def index
    @questions = Question.all.ordered

    if params[:active].present?
      @questions = @questions.active
    end

    if params[:last].present?
      @questions = @questions.last_finished
    end

    if params[:finished].present?
      @questions = @questions.finished
    end
  end

  # GET /questions/1
  def show
  end

  # POST /questions
  def create
    @question = Question.new(question_params)

    if @question.save
      render :show, status: :created, location: @question
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /questions/1
  def update
    if @question.update(question_params)
      render :show
    else
      render json: @question.errors, status: :unprocessable_entity
    end
  end

  # DELETE /questions/1
  def destroy
    @question.destroy!
  end

  def start
    @question.update!(started_at: Time.current, ended_at: Time.current + 30.seconds)
    render :show
  end

  def end
    @question.update!(ended_at: Time.current)
    render :show
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_question
      @question = Question.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def question_params
      params.require(:question).permit(:title, :image, :question_type, :point, :started_at, :ended_at, :display_order)
    end

    # Whether to display correct answer
    def set_show_correct
      @is_show_correct = params[:show_correct].present?
    end
end
