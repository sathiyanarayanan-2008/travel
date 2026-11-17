package com.voyagepilot.repository;

import com.voyagepilot.model.AgentLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AgentLogRepository extends MongoRepository<AgentLog, String> {
    List<AgentLog> findByConversationIdOrderByTimestampDesc(String conversationId);
    List<AgentLog> findByAgentTypeOrderByTimestampDesc(String agentType);
}
