require 'rails_helper'

RSpec.describe "articles/show", :type => :view do  context "no data" do
    subject { render }
    before :each do
        category = create :category
        @tags = Post.tag_counts_on(:tags, limit: 10)
        @post = create :valid_no_draft_post, category: category, tag_list: "TEST_TAG"
    end

    it "being displayed 'Title' " do
        should match(@post.title)
    end

    it "being displayed 'Tag Cloud' " do
        should match(/TEST_TAG/)
    end
  end

end
